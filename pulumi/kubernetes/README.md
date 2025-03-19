# Mesh Application - GitOps Kubernetes Deployment with Pulumi

This directory contains Pulumi code to manage the Kubernetes infrastructure for the Mesh application.

## Overview

Our GitOps CI/CD pipeline uses:

- **Pulumi**: Infrastructure as Code
- **GitHub Actions**: CI/CD pipeline
- **Kubernetes**: Container orchestration
- **Docker**: Container images
- **Environment-specific Configurations**: dev, staging, prod

## Infrastructure Components

The Pulumi code creates the following resources:

- Kubernetes namespace for each environment
- Frontend and backend deployments
- Services for internal communication
- Ingress for external access

## Environment Promotion Flow

Code changes follow this GitOps workflow:

1. Developers make changes and create PRs to `develop` branch
2. CI/CD pipeline builds and pushes Docker images
3. Pulumi previews infrastructure changes on PRs
4. When merged to `develop`, changes are deployed to staging
5. After testing, PR to `main` promotes to production
6. Merge to `main` triggers production deployment

## Local Development

To work with this infrastructure locally:

1. Install Pulumi CLI
2. Configure Kubernetes access
3. Set up the appropriate stack:

```bash
# For development
cd pulumi/kubernetes
pulumi stack select dev

# Preview changes
pulumi preview

# Apply changes
pulumi up
```

## Managing Secrets

Sensitive data is managed through Pulumi secrets and GitHub Secrets. 
Required secrets for CI/CD:

- `PULUMI_ACCESS_TOKEN`
- `AZURE_CREDENTIALS`
- `DOCKER_REPOSITORY`
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

## Adding New Resources

To add new Kubernetes resources:

1. Update the TypeScript code in `index.ts`
2. Configure environment-specific values in the appropriate `Pulumi.[env].yaml` files
3. Run `pulumi preview` to verify changes
4. Commit and push to trigger the CI/CD pipeline

## Rollback Procedure

To roll back to a previous version:

```bash
pulumi stack select [environment]
pulumi update --target-replace [resource] --to [version]
```

Or use the GitHub Actions workflow to deploy a previous commit. 