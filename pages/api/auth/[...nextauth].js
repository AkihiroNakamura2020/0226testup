import NextAuth from 'next-auth';
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  providers: [
    TwitterProvider({
        //clientId: process.env.TWITTER_CLIENT_ID,
        //clientSecret: process.env.TWITTER_CLIENT_SECRET,

        clientId: process.env.TWITTER_CONSUMER_KEY,
        clientSecret: process.env.TWITTER_CONSUMER_SECRET,
        
      })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // console.log("token"+token);
      // console.log("account"+account);
      // console.log(token);
      // console.log("account"+account);


      if (account) {
        token[account.provider] = {
          accessToken: account.oauth_token,
          refreshToken: account.oauth_token_secret,
        }
      }

      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken

      //console.log("session");
      //console.log(session);

      return session
    }
  
  },

  secret:process.env.NEXTAUTH_SECRET//これはtwitterのものではなくnextauthのsecret
  //$ openssl rand -base64 32で対応
  //自分でつけて良いよう

  
  
  
})