/**
 *  下载附件
 * @param {string} cid 
 * @param {string} filename 
 */

export const getAnnex = (cid, filename) => {
    var formData = new FormData();
    formData.append("cid", cid);
    formData.append("filename", filename);
    var xhr = new XMLHttpRequest();
    xhr.open("post", "/api/ipfs/get");
    xhr.send(formData);
    xhr.responseType = "blob"
    xhr.onload = function (data) {
      const content = data.currentTarget.response
      const link = document.createElement('a');
      let type = 'application/octet-stream'
      const blob = new Blob([content], {type: type});
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }