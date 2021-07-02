import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import styled from "styled-components";
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './components/Login';
import { auth } from './firebase';
import Spinner from 'react-spinkit';


function App() {
  const [user, loading] = useAuthState(auth);
  
  if (loading) {
    return (
      <AppLoading>
      <AppLoadingContent>
        <img src="data:image/png;base64,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" />
          <Spinner
            name="ball-spin-fade-loader"
            color= 'purple'
          fadeIn="none"
         />
      </AppLoadingContent>
   </AppLoading>
    )

 }

  return (
    <div className="App">
      <Router>
        {!user ? <Login /> : (
          <>
          {/* header is a navbar so it should not be inside the switch */}
          <Header />
          <AppBody>  
            <Sidebar />
            <Switch>
              <Route path="/" exact>
                {/* Chat */}
                 <Chat />
              </Route>
            </Switch>
          </AppBody>
        </>
        )}
        
      </Router>
    </div>
  );
}

export default App;

//AppBody is just a div from SC

const AppBody = styled.div`
display: flex;
height: 100vh;
`;

const AppLoading = styled.div`
display: grid;
place-items: center;
height:100vh;
width: 100%;
`;

const AppLoadingContent = styled.div`
text-align: center;
padding-bottom: 100px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;



> img{
  height: 100px;
  padding: 20px;
  margin-bottom: 40px;
}
`;