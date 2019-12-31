import React from 'react';
import { Redirect } from 'react-router-dom';
import { AuthService } from '../../helpers/IdentityServer';


export class Callback extends React.Component {
  authService
  constructor() {
    super();

    this.authService = new AuthService();
  }

  componentDidMount() {
    this.authService.completeLogin();
  }

  render() {
  return (
        <div>
           <Redirect
             to={{
               pathname: '/',
             }}
           />
        </div> 
        )
      }
    }