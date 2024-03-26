import Link from 'next/link'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'

export default function Page() {
    return (
    <html lang="en">
      <body>
        <nav className="navbar nacbar-expand-md nacbar-light bg-light mb-4 border">
          <Link href="/">
            CoTalk
          </Link>
          <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link href="/user/login">
                  Log in
                </Link>
              </li>
          </ul>
        </nav>
        <main role="main" className="container">
          <div className="pb-2 mb-2 border-bottom">
            <div className="jumbotron">
              <h1 className="display-3">Hello,</h1>

              <p className="lead">Welcome to CoTalk.</p>

              <a className="btn btn-lg btn-primary" href="/user/register"
                role="button">Register &raquo;</a>
            </div>
          </div>
        </main>
      </body>
    </html>
    );
}