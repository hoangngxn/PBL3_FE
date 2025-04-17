import Page from "../../layouts/login_signup/Page"
import LoginForm from "../../layouts/login_signup/Login_Form";
const Login = () => {
    return (
        <Page>
            <div className="flex items-center justify-center">
                <div>
                    <LoginForm />
                </div>
            </div>
        </Page>
    )
}

export default Login