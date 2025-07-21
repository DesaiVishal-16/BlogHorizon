import { PrimaryButton } from "../../Buttons";
import TitleHover from "../../hover/TitleHover";
import { Icons } from "../../icons";

const CopyLinkAction = ({isShowText=false}:{isShowText?:boolean}) => {
    const text = isShowText ? 'Copy Link' : ''
    return (
        <div className="copy-blog-link rounded-xl hover:bg-purple-900 group p-0.5 relative">
            <PrimaryButton
              name={text}
              icon={<Icons.CopyLink className="text-xl font-bold text-gray-400 group-hover:text-purple-500" />}
              className="bg-transparent hover:bg-transparent !text-gray-400 !text-lg group-hover:!text-purple-500"
            />
            <TitleHover title="Copy link" />
        </div>
    )
}
export default CopyLinkAction;