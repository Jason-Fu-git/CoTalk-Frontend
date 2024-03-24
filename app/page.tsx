import Link from 'next/link'
import React from 'react'
import { Button } from 'antd';
import 'antd/dist/reset.css';  

export default function Page() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h1 style={{ fontSize: '2em' }}>cotalk</h1>
        <div style={{ marginTop: '2em' }}>
          <Link href="/user/login">
            <Button type="primary" style={{ marginRight: '1em' }}>login</Button>
          </Link>
          <Link href="/user/register">
            <Button type="primary">register</Button>
          </Link>
        </div>
      </div>
    )
}