import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

// ============================================================================
// Configuration
// ============================================================================

const DOMAIN = 'life-cockpit.de';
const DESIGN_SUBDOMAIN = `design.${DOMAIN}`;
const MCP_SUBDOMAIN = `mcp.design.${DOMAIN}`;

// Set this to your Route53 Hosted Zone ID if the domain is managed there.
// If not using Route53, set to undefined and create the CNAME manually.
const HOSTED_ZONE_ID = process.env.HOSTED_ZONE_ID;

// ============================================================================
// Stack
// ============================================================================

class McpServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda Function with bundled MCP server
    const fn = new lambda.Function(this, 'McpHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist'), {
        exclude: ['*.map'],
      }),
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      architecture: lambda.Architecture.ARM_64, // Cheaper
      description: 'Life-Cockpit Design System MCP Server',
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    // Lambda Function URL (public, no auth)
    const fnUrl = fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ['Content-Type', 'mcp-session-id'],
        exposedHeaders: ['mcp-session-id'],
      },
    });

    // ACM Certificate (CDK auto-creates in us-east-1 via crossRegionReferences)
    const certificate = new acm.Certificate(this, 'McpCertificate', {
      domainName: MCP_SUBDOMAIN,
      validation: acm.CertificateValidation.fromDns(),
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'McpDistribution', {
      domainNames: [MCP_SUBDOMAIN],
      certificate,
      defaultBehavior: {
        origin: new origins.FunctionUrlOrigin(fnUrl),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      },
      comment: 'Life-Cockpit MCP Server',
    });

    // Route53 DNS Record (optional — only if domain is in Route53)
    if (HOSTED_ZONE_ID) {
      const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
        hostedZoneId: HOSTED_ZONE_ID,
        zoneName: DOMAIN,
      });

      new route53.ARecord(this, 'McpAliasRecord', {
        zone: hostedZone,
        recordName: 'mcp.design',
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distribution)
        ),
      });
    }

    // Outputs
    new cdk.CfnOutput(this, 'LambdaFunctionUrl', {
      value: fnUrl.url,
      description: 'Direct Lambda Function URL',
    });

    new cdk.CfnOutput(this, 'CloudFrontUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });

    new cdk.CfnOutput(this, 'McpEndpoint', {
      value: `https://${MCP_SUBDOMAIN}/mcp`,
      description: 'Public MCP endpoint',
    });

    new cdk.CfnOutput(this, 'DnsTarget', {
      value: distribution.distributionDomainName,
      description: 'CNAME target for mcp.design.life-cockpit.de (if not using Route53)',
    });
  }
}

// ============================================================================
// Docs Stack (Design System Demo App — Static SPA)
// ============================================================================

class DocsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for static site (private, only accessible via CloudFront)
    const bucket = new s3.Bucket(this, 'DocsBucket', {
      bucketName: `life-cockpit-docs-${this.account}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // ACM Certificate (CDK auto-creates in us-east-1 via crossRegionReferences)
    const certificate = new acm.Certificate(this, 'DocsCertificate', {
      domainName: DESIGN_SUBDOMAIN,
      validation: acm.CertificateValidation.fromDns(),
    });

    // CloudFront Origin Access Identity
    const oai = new cloudfront.OriginAccessIdentity(this, 'DocsOAI');
    bucket.grantRead(oai);

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'DocsDistribution', {
      domainNames: [DESIGN_SUBDOMAIN],
      certificate,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessIdentity(bucket, { originAccessIdentity: oai }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      // SPA: route all 404s to index.html for client-side routing
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      comment: 'Life-Cockpit Design System Docs',
    });

    // Deploy built Angular app to S3
    new s3deploy.BucketDeployment(this, 'DocsDeployment', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../../dist/apps/demo/browser'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Route53 DNS Record (optional)
    if (HOSTED_ZONE_ID) {
      const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
        hostedZoneId: HOSTED_ZONE_ID,
        zoneName: DOMAIN,
      });

      new route53.ARecord(this, 'DocsAliasRecord', {
        zone: hostedZone,
        recordName: 'design',
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distribution)
        ),
      });
    }

    // Outputs
    new cdk.CfnOutput(this, 'DocsUrl', {
      value: `https://${DESIGN_SUBDOMAIN}`,
      description: 'Design System Documentation URL',
    });

    new cdk.CfnOutput(this, 'CloudFrontUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });

    new cdk.CfnOutput(this, 'DocsDnsTarget', {
      value: distribution.distributionDomainName,
      description: 'CNAME target for design.life-cockpit.de (if not using Route53)',
    });

    new cdk.CfnOutput(this, 'S3Bucket', {
      value: bucket.bucketName,
      description: 'S3 bucket for docs deployment',
    });
  }
}

// ============================================================================
// App
// ============================================================================

const app = new cdk.App();

const account = process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID;

// Application-level tags — applied to all resources in all stacks
const APP_NAME = 'life-cockpit-design-system';
cdk.Tags.of(app).add('Application', APP_NAME);
cdk.Tags.of(app).add('ManagedBy', 'cdk');
cdk.Tags.of(app).add('Repository', 'Life-Cockpit/lc-design-system');

new McpServerStack(app, 'LifeCockpitMcpServer', {
  env: {
    account,
    region: 'eu-central-1',
  },
  crossRegionReferences: true,
  description: 'Life-Cockpit Design System MCP Server',
  tags: {
    Service: 'mcp-server',
  },
});

new DocsStack(app, 'LifeCockpitDocs', {
  env: {
    account,
    region: 'eu-central-1',
  },
  crossRegionReferences: true,
  description: 'Life-Cockpit Design System Documentation',
  tags: {
    Service: 'docs',
  },
});

app.synth();
