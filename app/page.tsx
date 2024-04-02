import Link from 'next/link'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'

export default function Page() {
    return (
    <>
      <main role="main" className="container">
        <div className="pb-2 mb-2 border-bottom">
          <div className="jumbotron">
            <h1 className="display-3">Hello,</h1>
            <p className="lead">Welcome to CoTalk.</p>
            <a className="btn btn-lg btn-primary" href="/user/login"
              role="button">Login &raquo;</a>
          </div>
        </div>
      </main>
    </>
    );
}