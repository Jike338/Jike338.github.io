function copyToClipboard() {
    const email = 'zhong.523@osu.edu'
  
    // Create a temporary textarea to hold the email text and select it
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = email;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
  
    alert("Email copied to clipboard!");
  }

function createProjectElement(id, project){
    /* Create an element in Project
    tag: some tags
    title: title of the project or publications
    paper_url: link to the paper
    authors: authors
    conference: publication venue
    image (optional): directory to project image
    others (optional): anything else
    */
    if (project.tag == null)
        project.tag = id;
    if (project.others == null)
        project.others = "";

    html_img = `<img src='${project.image}' style="max-width: 160px"></div></div>`
    html_txt = `<p>
      <a href="${project.paper_url}"><papertitle>${project.title}</papertitle></a>
      <br>
      ${project.authors}
      <br>
      <em>${project.conference}</em>
      <br>
      <br>
      <br>
      ${project.description}`

    document.getElementById(id + "-img").innerHTML = html_img;
    document.getElementById(id + "-txt").innerHTML = html_txt;
}


