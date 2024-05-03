import React from 'react';

const SuccessMessage = ({ StudioId }) => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12"> {/* Change col-md-5 to col-md-12 */}
          <div className="_success message-box">
            <i className="fa fa-check-circle" aria-hidden="true"></i>
            <h3>Your Studio registration was successful</h3>
            <p>{StudioId} is now registered 🎉</p>
          </div>
        </div>
      </div>
      <hr />

      <style jsx>{`
        ._success {
          padding: 45px;
          width: 100%;
          text-align: center;
          margin: 30px auto;
        }

        ._success i {
          font-size: 55px;
          color: #28a745;
        }

        ._success h2 {
          margin-bottom: 12px;
          font-size: 30px;
          font-weight: 300;
          line-height: 1.2;
          margin-top: 10px;
        }

        ._success p {
          margin-bottom: 0px;
          font-size: 18px;
          color: #495057;
          font-weight: 100;
        }
      `}</style>
    </div>
  );
};

export default SuccessMessage;
