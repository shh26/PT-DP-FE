
const Header = ({ title }: { title: string }) => {
    return (
      <div className="w-full md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
        </div>
      
      </div>
    );
  };
  
  export default Header;