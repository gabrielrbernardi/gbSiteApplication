import React from 'react';
import { useCookies } from 'react-cookie';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import HeaderLogin from './components/Header/HeaderLogin';
import HeaderNotLogin from './components/Header/HeaderNotLogin';
import Cycle from './pages/Cycle/Cycle';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import { returnAuth } from './services/middleware';
import { MiddlewareServices } from './services/MmiddlewareServices';

const middlewareServices = new MiddlewareServices();

const PrivateRoute = ({ component: Component, ...rest }: any) => {
    const [getCookie] = useCookies();
    // console.log(getCookie)
    
    return(
        <Route
            {...rest}
            render={
                props => 
                returnAuth(getCookie) && middlewareServices.checkToken(getCookie) ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/", state: { from: props.location } }} />
                )
            }
        />
    )

}

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                {/* <Route path="/recomendations" render={() => (<div><Header/><Recomendations/><Footer/></div>)}/> */}
                {/* <Route path="/home" render={() => (<div><Header/><Recomendations/><Footer/></div>)}/>
                <Route path="/users" render={() => (<div><Header/><Users/><Footer/></div>)}/>
                <Route path="/clients/create" render={() => (<div><Header/><InsertClient/><Footer/></div>)}/>
                <Route path="/clients" render={() => (<div><Header/><Clients/><Footer/></div>)}/> */}

                <Route path="/" render={() => (<div><HeaderNotLogin /><Login /></div>)} exact />
                <Route path="/signup" render={() => (<div><HeaderNotLogin /><Signup /></div>)} />

                <PrivateRoute path="/home" component={() => (<div><HeaderLogin /><Home /></div>)} exact />

                <PrivateRoute path="/ciclos" component={() => (<div><HeaderLogin /><Cycle /></div>)} exact />

            </Switch>
        </BrowserRouter>
    );
}

export default Routes;