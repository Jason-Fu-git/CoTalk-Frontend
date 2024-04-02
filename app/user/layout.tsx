import React from 'react'
import Link from 'next/link'
import styles from './Layout.module.css'

export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Link href="/" className={styles.link}>
            CoTalk
          </Link>
          <Link href="/chat" className={styles.link}>
            群聊
          </Link>
          <Link href="/friend" className={styles.link}>
            好友
          </Link>
        </div>
        <section className={styles.content}>{children}</section>
      </div>
    )
}