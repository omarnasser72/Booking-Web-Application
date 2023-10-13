export const userColumns = [
  { field: "_id", headerName: "ID", width: 170 },
  {
    field: "user",
    headerName: "User",
    width: 200,
    renderCell: (params) => {
      console.log(`${process.env.PUBLIC_URL}/upload/${params.row.img}`);
      return (
        <div className="cellWithImg">
          <img
            src={
              params.row.img || params.row.img !== undefined
                ? `${process.env.PUBLIC_URL}/upload/${params.row.img}`
                : "https://i.ibb.co/MBtjqXQ/no-avatar.gif"
            }
            alt=""
            className="cellImg"
          />
          {params.row.username}
        </div>
      );
    },
  },
  { field: "email", headerName: "Email", width: 230 },
  { field: "age", headerName: "Age", width: 30 },
  {
    field: "country",
    headerName: "Country",
    width: 70,
  },
  {
    field: "city",
    headerName: "City",
    width: 70,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150,
  },
];

export const hotelColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "city",
    headerName: "City",
    width: 100,
  },
];

export const roomColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "title",
    headerName: "Title",
    width: 70,
  },
  {
    field: "desc",
    headerName: "Description",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
  {
    field: "maxPeople",
    headerName: "Max People",
    width: 100,
  },
  {
    field: "images",
    headerName: "Images",
    width: 70,
    renderCell: (params) => {
      // console.log("./upload/rooms/".concat(params.row.images[0]));
      return (
        <div className="cellWithImg">
          {params.row.images && (
            <img
              src={
                params.row.img || params.row.img !== undefined
                  ? "./upload/rooms/".concat(params.row.images[0])
                  : "https://static.vecteezy.com/system/resources/thumbnails/008/547/655/small/bed-icon-logo-design-template-free-vector.jpg"
              }
              alt=""
              className="cellImg"
            />
          )}
        </div>
      );
    },
  },
];

export const reservationColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "userId",
    headerName: "User ID",
    width: 150,
  },
  {
    field: "roomTypeId",
    headerName: "Room Type ID",
    width: 150,
  },
  {
    field: "roomNumberId",
    headerName: "Room Number ID",
    width: 150,
  },
  {
    field: "startDate",
    headerName: "StartDate",
    width: 150,
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 150,
  },
];
