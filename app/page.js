import Link from 'next/link'
import React from 'react'
import { Button } from 'antd';
import 'antd/dist/reset.css';  
import 'bootstrap/dist/css/bootstrap.css'

export default function Page() {
    return (
		<body>
			<nav class="navbar nacbar-expand-md nacbar-light bg-light mb-4 border">
				<Link href="/">
					CoTalk
				</Link>
				<button class="navbar-toggler" type="button" data-toggle="collapse"
					data-target="#navbarCollapse" aria-controls="navbarCollapse"
					aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span></button>

				<ul class="navbar-nav ml-auto" style="flex-direction:row">
						<li class="nav-item">
							<Link href="/user/login">
								Log in
							</Link>
						</li>
				</ul>
			</nav>
			<div class="jumbotron">
				<h1 class="display-3">Hello,</h1>

				<p class="lead">Welcome to CoTalk.</p>

				<a class="btn btn-lg btn-primary" href="/user/register"
					role="button">Register &raquo;</a>
			</div>
		</body>
    );
}