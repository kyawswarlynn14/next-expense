import React from "react"
import AuthForm from "@/components/forms/AuthForm"

const LoginForm: React.FC = () => {
  return (
    <AuthForm isLogin={true} />
  )
}

export default LoginForm