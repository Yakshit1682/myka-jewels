import { Gem } from "lucide-react";

type PageLoaderProps = {
  text?: string;
};

const PageLoader = ({ text = "Loading jewellery..." }: PageLoaderProps) => {
  return (
    <div className="page-loader">
      <div className="page-loader-inner">
        <div className="page-loader-icon">
          <Gem size={28} strokeWidth={1.2} />
        </div>

        <span className="page-loader-brand">MYKA</span>

        <p>{text}</p>

        <div className="page-loader-line">
          <span />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
