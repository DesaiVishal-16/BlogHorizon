import { PrimaryButton } from "../../Buttons";
import TitleHover from "../../hover/TitleHover";
import { Icons } from "../../icons";

interface CommentActionProps {
  count?: number;
  isShowCount?: boolean;
  isShowText?: boolean;
  name?: string;
  onClick?: () => void;
}

const CommentAction = ({
  count,
  isShowCount = true,
  name,
  onClick,
}: CommentActionProps) => {
  return (
    <div className="comments flex items-center gap-1 group" onClick={onClick}>
      <div className="group-hover:bg-blue-900 rounded-xl relative">
        <PrimaryButton
          name={name}
          title="comments"
          icon={
            <Icons.Comments className="text-xl font-bold text-gray-400 group-hover:text-blue-500" />
          }
          className="bg-transparent hover:bg-transparent !text-gray-400 !text-lg group-hover:!text-blue-500"
        />
      </div>
      <div className="comments-counts flex ">
        {isShowCount && (
          <span className="text-gray-300 group-hover:text-blue-600">
            {count}
          </span>
        )}
      </div>
      <TitleHover title="Comments" />
    </div>
  );
};
export default CommentAction;
