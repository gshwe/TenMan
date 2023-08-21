import React, { useState } from 'react';
import logo from './logo.svg';
//import { Helmet } from 'react-helmet'

import { PageLayout } from './components/PageLayout';
import { loginRequest } from './authConfig';
import { callMsGraph } from './graph';
import { ProfileData } from './components/ProfileData';

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { useIsAuthenticated } from "@azure/msal-react";



//import './App.css';
//import './css/app.css';

import Button from 'react-bootstrap/Button';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';


/**
* Renders information about the signed-in user or a button to retrieve data about the user
*/
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });
    }
    if (accounts.length > 0 && accounts[0] != null) {
        return (
            <>
                <h5 className="card-title">Welcome {accounts[0].name}</h5>
                <br />
                {graphData ? (
                    <ProfileData graphData={graphData} />
                ) : (
                    <Button variant="secondary" onClick={RequestProfileData}>
                        Request Profile Information
                    </Button>
                )}
            </>
        );
    } else {
        return (
            <>
                Nothing....
            </>
        );
    }
        

};

/**
* If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
*/
const MainContent = () => {

    return (
        <div className="app">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5>
                    <center>
                        Please sign-in to see your profile information.
                    </center>
                </h5>
            </UnauthenticatedTemplate>
        </div>
    );
};



function App() {
    const { instance } = useMsal();

    const handleLogin = (loginType: string) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest).catch((e) => {
                console.log(e);
            });
        } else if (loginType === "redirect") {
            instance.loginRedirect(loginRequest).catch((e) => {
                console.log(e);
            });
        }
    };

    return (
        <>
            <div className="wrapper">

                <AuthenticatedTemplate>

                    <Sidebar />

                    <div className="main">
                        <Navbar />

                        <main className="content">
                        </main>

                        <Footer />
                    </div>

                </AuthenticatedTemplate>

                <UnauthenticatedTemplate>
                    <Button onClick={() => handleLogin("redirect")}>
                        Sign in using Redirect
                    </Button>
                </UnauthenticatedTemplate>

                
            </div>
            {/*<div className="wrapper">
                
                <PageLayout>
                    <MainContent />
                </PageLayout>
            </div> */ }
            

            {/* <Helmet>
                <script src=
                    "/js/app.js"
                    type="text/javascript" />
            </Helmet>
            */}
            
        </>
        
    );
}



export default App;
