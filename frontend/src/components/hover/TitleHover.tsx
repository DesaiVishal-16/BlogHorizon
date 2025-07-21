interface Prpos{
    title: string;
}
const TitleHover = ({title}:Prpos) => {
 return(
    <span className='absolute bottom-full mb-2 left-1/2 -translate-x-[50%] hidden group-hover:block bg-white 
           text-gray-900 text-sm px-2 py-1 rounded-xl shadow-lg whitespace-nowrap z-10'>
        {title}
    </span>
 )
};
export default TitleHover;