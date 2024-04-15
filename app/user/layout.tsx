import React from 'react'
import Link from 'next/link'
import styles from './Layout.module.css'

export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <section className={styles.content}>
			{children}
		</section>
    )
}