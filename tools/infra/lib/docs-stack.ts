import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import * as path from 'path';

export class DocsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainName = 'design.life-cockpit.de';

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      'arn:aws:acm:us-east-1:066452446040:certificate/f6dc8443-780d-4ae4-9d9f-6731e0afc91c'
    );

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
      hostedZoneId: 'Z0892259UOQ10N7JM5BT',
      zoneName: 'life-cockpit.de',
    });

    const bucket = new s3.Bucket(this, 'DocsBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const distribution = new cloudfront.Distribution(this, 'DocsDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [domainName],
      certificate,
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    new s3deploy.BucketDeployment(this, 'DeployDocs', {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, '..', '..', '..', 'dist', 'storybook', 'angular-ui-kit')),
      ],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'DocsUrl', {
      value: `https://${domainName}`,
      description: 'Docs URL',
    });
  }
}
