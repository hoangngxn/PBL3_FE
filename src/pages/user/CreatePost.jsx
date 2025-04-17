import FormPost from '../../layouts/formPost/FormPost'
import Parent from '../../layouts/PageAuthorization/parent/parent'
import Panel_Search from '../../layouts/panel/Panel_Search'
const CreatePost = () => {
    return (
        <Parent>
            <Panel_Search>
                <FormPost func="ĐĂNG BÀI" />
            </Panel_Search>
        </Parent>

    )
}

export default CreatePost