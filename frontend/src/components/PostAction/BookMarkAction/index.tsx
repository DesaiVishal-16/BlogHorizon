import { PrimaryButton } from "../../Buttons";
import TitleHover from "../../hover/TitleHover";
import { Icons } from "../../icons";

const BookMarkAction = ({isShowText=false}:{isShowText?:boolean}) => {
    const text = isShowText ? 'BookMark' : '';
    return(
        <div className="bookmarks rounded-xl hover:bg-orange-900 group p-0.5 relative">
            <PrimaryButton name={text}
              icon={<Icons.Bookmark className="text-xl text-gray-400 group-hover:text-orange-500" />}
              className="bg-transparent hover:bg-transparent !text-gray-400 !text-lg group-hover:!text-orange-500"
            />
            <TitleHover title="Bookmarks" />
        </div>
    )
};

export default BookMarkAction;