# Connect UI Example – NextJS Pages Router

The Connect UI example demonstrates how to use the Synqly's Connect UI in a multi-tenant Next JS application. It demonstrates how Connect UI is used to allow end-users to configure their integrations, as well as how to retrieve details about the integration.

For more information about Synqly, please see <https://www.synqly.com>.

This example shows you how to:

- Define multiple tenants in a sample application
- Define integration points that are global to the organization
- Integrate Connect UI with a simple NextJS application

> [!TIP]
> Reference documentation for Synqly APIs are available at <https://docs.synqly.com>.

## Prerequisites

- A [Synqly](https://synqly.com) Organization
- Your Synqly Organization Token

## Setup and run the example

> [!IMPORTANT]
> While Synqly is in private beta, the [Synqly Client SDK] and [Synqly Connect React SDK] can only be installed from a private GitHub repo. To install the SDKs, make sure you have set up SSH access to the private GitHub repos [Synqly/typescript-client-sdk] and [Synqly/connect-react-sdk]. Please contact us if you need access.

1. Clone this repository and navigate the directory of this example:
   ```bash
   cd connect/nextjs-pages
   ```
2. Rename [.env.template](./.env.template) to `.env.local` and set the variable `SYNQLY_ORG_TOKEN` to the value of your organization access token – you can find this in your [Synqly organization settings](https://app.synqly.com/settings/secrets)
3. Install dependencies
   ```bash
   npm install
   ```
4. Start the demo
   ```bash
   npm start
   ```

Exit the example by pressing `Ctrl+C`, or wait until it completes its run.

To clean up the sample data that was generated at startup, run [scripts/clean-demo-data.mjs]

[Synqly Client SDK]: https://github.com/Synqly/typescript-client-sdk
[Synqly/typescript-client-sdk]: https://github.com/Synqly/typescript-client-sdk
[Synqly Connect React SDK]: https://github.com/Synqly/connect-react-sdk
[Synqly/connect-react-sdk]: https://github.com/Synqly/connect-react-sdk

## Support

If you have questions or need support with this example or Synqly's platform, please don't hesitate to contact us!