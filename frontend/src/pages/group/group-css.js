export const groupStyles = {
  fr: {
    float: "right",
  },
  mb_2: {
    mb: 2,
  },
  mt_2: {
    mt: 2,
  },
  fr_mb_2: {
    float: "right",
    mb: 2,
  },
  fw: {
    width: "100%",
    mb: 2,
  },
  j_right: {
    justifyContent: "right",
  },
  d_flex: {
    display: "flex",
  },
  get gp_main() {
    return {
      ...this.j_right,
      ...this.d_flex,
    };
  },
  t_transform_btn: {
    textTransform: "none",
    padding: "10px",
    fontSize: "16px",
  },
  t_align: {
    textAlign: "left",
  },
  get btn_g_box() {
    return {
      ...this.t_align,
      ...this.mt_2,
    };
  },
};
