const styles = () => ({
  body: {
    display: "flex"
  },
  hamburger: {
    cursor: "pointer",
    float: "left",
    height: "16px",
    margin: "4px 4px 4px 4px",
    width: "16px"
  },
  invisible: {
    display: "none"
  },
  page: {
    // main page theme
    alignitems: "stretch",
    color: "white",
    flexdirection: "row",
    textAlign: "center",
    width: "100%"
  },
  songListDiv: {
    // song list div
    flex: "40%"
  },
  songListItem: {
    // ListItem component
    cursor: "move",
    display: "flex"
  },
  songListItemDiff: {
    // The ranking component "1 /\"
    backgroundColor: "#1F2533",
    height: "24px",
    marginRight: "20px",
    width: "64px"
  },
  songListItemDiv: {
    // The draggable div component
    display: "flex",
    width: "100%"
  },
  songListItemDivToggled: {
    // The draggable div component
    backgroundColor: "#1F2533",
    display: "flex",
    width: "100%"
  },
  songListItemPic: {
    // The image containing the chevron
    float: "right",
    height: "16px",
    margin: "4px 2px 4px 0px",
    width: "16px"
  },
  selectDiv: {
    flex: "60%"
  },
  table: {
    margin: "0px auto",
    width: "90%"
  },
  tableCell: {
    color: "white",
    textAlign: "left",
    userSelect: "none"
  },
  tableCellTitle: {
    color: "white",
    textAlign: "left",
    width: "50%"
  },
  tableCellArtist: {
    color: "white",
    textAlign: "left",
    width: "40%"
  },
  tableCellEdit: {
    color: "white",
    width: "24px"
  }
});

export default styles;
