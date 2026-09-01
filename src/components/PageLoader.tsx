type PageLoaderProps = {
  text?: string;
};

const PageLoader = ({ text = "Loading jewellery..." }: PageLoaderProps) => {
  return (
    <div className="page-loader">
      <div className="page-loader-inner">
        <div className="page-loader-icon">
          {/* <Gem size={28} strokeWidth={1.2} /> */}
          <span aria-hidden="true" style={{ fontSize: '28px' }}>&#10024;</span>
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
