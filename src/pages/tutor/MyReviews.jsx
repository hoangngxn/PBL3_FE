import Page from "../../layouts/panel/Panel";
import Tutor from "../../layouts/PageAuthorization/tutor/tutor";
import Review from "../../layouts/review/Review";
import { useAppContext } from "../../AppProvider";

const MyReviews = () => {
  const { id } = useAppContext()
  return (
    <Tutor>
      <Page role="tutor" activeItem={5}>
        <Review height='max-h-[600px]' tutor_id={id} />
      </Page>
    </Tutor>
  );
};

export default MyReviews;
