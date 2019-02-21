export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "us-east-1",
      BUCKET: "notes-app-uploads-schwartz"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://iutq8d4vee.execute-api.us-east-1.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_Ggul1LuVU",
      APP_CLIENT_ID: "66vsmvsjtbsu7tv5baihlo2ko",
      IDENTITY_POOL_ID: "us-east-1:d527b72d-66f0-4dc9-9915-6f90b8a19eeb"
    }
  };