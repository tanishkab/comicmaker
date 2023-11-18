import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  comicPanels: {desc: string, loading: boolean}[] = [];

  ngOnInit(): void {
    this.addPanel()
  }

  addPanel() {
    this.comicPanels.push({desc: "", loading: false});
  }

  setDesc(event: Event, index: number) {
    this.comicPanels[index].desc = (event?.target as HTMLInputElement)?.value;
  }

  fetchImage() {
    this.query({ "inputs": "Astronaut riding a horse" }).then((myBlob) => {
      var myImage = document.querySelector('img');
      var objectURL = URL.createObjectURL(myBlob);
      if (myImage)
        myImage.src = objectURL;
    });

  }

  async query(data: any) {
    const response = await fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: {
          "Accept": "image/png",
          "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return result;
  }

  async generateImage(index: number) {
    this.comicPanels[index].loading = true;
    const data = { "inputs": this.comicPanels[index].desc };

    this.query(data).then((response) => {
      const comicDisplay = document.getElementById("comicDisplay");
      const imageUrl = URL.createObjectURL(response);
      const imageElement = document.createElement("img");
      imageElement.src = imageUrl;
      if (comicDisplay) {
        comicDisplay.innerHTML = "";
        comicDisplay.appendChild(imageElement);
      }
      this.comicPanels[index].loading = false;
    }).catch((error) => {
      console.error("Error generating comic:", error);
      this.comicPanels[index].loading = false;
    });
  }

  sharePanel() {

  }
}
