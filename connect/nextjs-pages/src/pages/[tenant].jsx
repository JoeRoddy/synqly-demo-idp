'use client';
import { IntegrationCard } from '@/components/integration-card';
import { Header, Main } from '@/components/skeleton';
import { Heading } from '@radix-ui/themes';
import { ManagementClient } from '@synqly/client-sdk';

export { Page as default, getServerSideProps };

/** @param {import('next').GetServerSidePropsContext} context */
async function getServerSideProps(context) {
  // Using the SYNQLY_ORG_TOKEN on the server side is ok, because it's a
  // trusted environment. However you must never use this in an untrusted
  // environment like a web browser. For that, rely on token exchange to
  // retrieve a more ephemeral and tightly scoped token. An example of
  // this is shown later in this function.
  // ManagementClient should only be used on the server.
  const client = new ManagementClient({
    token: process.env.SYNQLY_ORG_TOKEN,
    environment: process.env.NEXT_PUBLIC_SYNQLY_API_ROOT,
  });

  // Typically in a multi-tenant application you'd have some identifier for
  // the tenant in your system. In this demo, that identifier is `tenant`.
  //
  // We use this `tenant` identifier to get the Synqly account details,
  // which we'll then pass on to Connect UI so it can tell which account to
  // configure integrations for.
  //
  // This demo is stateless so it relies on naming to associate the demo app
  // tenants with Synqly accounts. The script that generates sample data
  // uses the DEMO_PREFIX environment variable in combination with a
  // generated slug, so we use that to find the Synqly account details
  // here.
  //
  // A more typical setup however might be to store away the Synqly account
  // id along with your other tenant details.
  const { tenant } = context.query;
  const { body: account } = await client.accounts.get(`${process.env.DEMO_PREFIX}${tenant}`);

  if (!account) {
    return {
      notFound: true,
    };
  }

  // Before we render the page, we need to exchange our SYNQLY_ORG_TOKEN for
  // a more ephemeral and tightly scoped access token. You must never use
  // the SYNQLY_ORG_TOKEN in untrusted environments like a web browser.
  // Instead, always rely on token exchange to create a token more suitable
  // the task at hand.
  //
  // For Connect UI there's a specific permission set called `connect-ui`.
  // This permission set only includes the specific permissions necessary
  // for Connect UI to do its job. This ensures that even though we're
  // using this token in an untrusted environment, it can only be used to
  // connect or disconnect integrations for the specified account.
  //
  // For more information about Synqly tokens, please refer to the docs:
  // https://docs.synqly.com/reference/api-authentication
  const { body: tokenPair } = await client.tokens.createToken({
    permissionSet: 'connect-ui',
    resources: {
      accounts: {
        ids: [account.result.id],
      },
    },
  });

  if (!tokenPair) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      token: tokenPair.result.primary.access.secret,
      account: serialize(account.result),
    },
  };
}

function Page({ token, account }) {
  return (
    <>
      <Header />
      <Main>
        <Heading>{account.fullname}</Heading>
        {/* The IntegrationCard component is an example of how you could
        abstract the integration point management into components that make
        sense to your use case and code base. Here we use the same
        component twice, just with different parameters. Please see
        scripts/generate-demo-data.mjs for more detail of the integration
        points created for this demo. */}
        <IntegrationCard
          integrationPointName={process.env.NEXT_PUBLIC_AUDIT_LOG_EXPORT_ID}
          title="Audit Log Export"
          account={account}
          token={token}
        >
          Audit Logs are retained for 24 hours. Add an integration to store them longer.
        </IntegrationCard>
        <IntegrationCard
          integrationPointName={process.env.NEXT_PUBLIC_SLACK_NOTIFICATIONS_ID}
          title="Slack Notifications"
          account={account}
          token={token}
          provider="slack"
        >
          This integration point only supports Slack as the provider.
        </IntegrationCard>
        <IntegrationCard
          integrationPointName={process.env.NEXT_PUBLIC_SYNQLY_IDP_ID}
          title="Identity"
          account={account}
          token={token}
        >
          Identity ___ My new integration point
        </IntegrationCard>
      </Main>
    </>
  );
}

function serialize(obj) {
  return obj != null ? JSON.parse(JSON.stringify(obj)) : null;
}
