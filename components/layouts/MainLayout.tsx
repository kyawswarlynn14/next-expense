"use client";

import { store } from '@/store'
import React from 'react'
import { Provider } from 'react-redux'
import { Toaster } from '../ui/toaster';

function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
        {children}
        <Toaster />
    </Provider>
  )
}

export default MainLayout