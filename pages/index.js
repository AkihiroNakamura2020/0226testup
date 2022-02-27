import { useSession, signIn, signOut , getSession} from "next-auth/react"
import { useState } from 'react';

import { useEffect } from 'react';

import { TwitterTimelineEmbed,  TwitterTweetEmbed } from 'react-twitter-embed';

export default function Home() {//{ session }
  const { data: session } = useSession()
  //console.log("session000");
  //console.log(JSON.stringify(session));
  const [statuses, setStatuses] = useState();
  const [mymedium, setMedium] = useState();

  async function handleOnSearchSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = formData.get('query');

    const results = await fetch('/api/twitter/search', {//ここでserch.jsに飛ばし
      method: 'POST',
      body: JSON.stringify({
        query
      })
    }).then(res => res.json());

    setStatuses(results.data);
  }

  async function handleOnTweetSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const status = formData.get('status');

    const results = await fetch('/api/twitter/tweet', {
      method: 'POST',
      body: JSON.stringify({
        status
      })
    }).then(res => res.json());

    alert('Success!')
  }

  // async function handleOnStreamSubmit(e) {
  //   e.preventDefault();
    
  //   const results = await fetch('/api/twitter/stream', {
  //     credentials: 'include'
  //   }).then(res => res.json());
  //   //console.log(results);
  //   console.log('hi');
  //   console.log(results.data);

  //   setStatuses(results.data);
  // }

  //通常実行
  async function handleOnStreamSubmitb() {
    
    const results = await fetch('/api/twitter/stream', {
      //credentials: 'include'
    }).then(res => res.json());
    console.log(results.data);
    
    setStatuses(results.data);
  }

  useEffect(() => {
    if (session) {
      handleOnStreamSubmitb();
    }
     
  },[])

  //medium

  async function handleOnMediumSubmit(e) {
    e.preventDefault();

    const endpoint = "https://api.rss2json.com/v1/api.json";
    const feed_url = "https://medium.com/feed/@Nakithemagic";
    
     // rss feed を取得
    var res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feed_url}`);
    // text を json 化
    var results = await res.json();
    //console.log("medium");
    //console.log(results.items);
    
    setMedium(results.items);
  }

  //debank

  async function handleOnDebankSubmit(e) {
    e.preventDefault();
    
    const res = await fetch('https://openapi.debank.com/v1/user/total_balance?id=0xa242fcb2acbb118ea1b6829efe8b7e2087b43986', {
        headers: {
            'accept': 'application/json'
        }
    });

    var results = await res.json();
    console.log(results);
    
    //setStatuses(results.data);
  }


  if (session) {
    //handleOnStreamSubmitb()

  //   <form onSubmit={handleOnStreamSubmit}>
  //   <h2>Timeline</h2>
  //   <button>Timeline</button>
  // </form>

    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>

        <div>
          <form onSubmit={handleOnTweetSubmit}>
            <h2>Tweet</h2>
            <textarea name="status" />
            <button>Tweet</button>
          </form>

          <form onSubmit={handleOnSearchSubmit}>
            <h2>Search</h2>
            <input type="search" name="query" />
            <button>Search</button>
          </form>

          <form onSubmit={handleOnMediumSubmit}>
            <h2>Medium</h2>
            <button>Medium feed</button>
          </form>

          <form onSubmit={handleOnDebankSubmit}>
            <h2>Debank</h2>
            <button>Debank get</button>
          </form>

          {mymedium && (
            <ul>
              { mymedium.map((item,index) => {
                return (
                  <li key={index}>
                    <p>{ item.author }</p>
                    <p>{ item.title } </p>
                  </li>
                );
              })}
            </ul>
          )}

          {statuses && (
            <>
              { statuses.map(({ key, id_str,text }) => {
                return (
                 
                    <TwitterTweetEmbed
                      tweetId={id_str}
                    />
                  
                );
              })}
            </>
          )}
        </div>
      </>
    )
  }else{
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  }

}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  //console.log("session SS");
  //console.log(session);

  return {
    props: {
      session
    }
  }
}