import FormPost from '../../layouts/formPost/FormPost'
import Parent from '../../layouts/PageAuthorization/parent/parent'
import Panel_Search from '../../layouts/panel/Panel_Search'
import { useParams } from 'react-router-dom'
const UpdatePost = () => {
    const { postId } = useParams();
    return (
        <Parent>
            <Panel_Search>
                <FormPost postId={postId} func="CẬP NHẬT BÀI ĐĂNG" />
            </Panel_Search>
        </Parent>
    )
}

export default UpdatePost