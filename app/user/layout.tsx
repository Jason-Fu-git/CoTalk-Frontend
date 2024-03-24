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
          <Link href="/chat" className={styles.link}>
            chat
          </Link>
          <Link href="/friend" className={styles.link}>
            friend
          </Link>
        </div>
        <section className={styles.content}>{children}</section>
      </div>
    )
}