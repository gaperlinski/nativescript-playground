import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryListService} from "../../shared/grocery/grocery-list.service";
import {TextField} from "ui/text-field";
import {Color} from "color";

var socialShare = require("nativescript-social-share");
declare var android;
declare var CGSizeMake: any;

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryListService]
})

export class ListPage implements OnInit {

  groceryList: Array<Grocery> = [];
  grocery: string = "";
  isLoading = false;
  listLoaded = false;
  @ViewChild("groceryTextField") groceryTextField: ElementRef;

  constructor(private _groceryListService: GroceryListService) {}

  ngOnInit() {
  this.isLoading = true;
  this._groceryListService.load()
    .subscribe(loadedGroceries => {
      loadedGroceries.forEach((groceryObject) => {
        this.groceryList.unshift(groceryObject);
      });
      this.isLoading = false;
      this.listLoaded = true;
    });
  }

  add() {
    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    // Dismiss the keyboard
    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.ios.layer.shadowOpacity = 1.0;
    textField.ios.layer.shadowRadius = 0.0;
    textField.ios.layer.shadowColor = new Color('#000000').ios.CGColor;
    textField.ios.layer.shadowOffset = CGSizeMake(0.0, -1.0);

    this._groceryListService.add(this.grocery)
      .subscribe(
        groceryObject => {
          this.groceryList.unshift(groceryObject);
          this.grocery = "";
        },
        () => {
          alert({
            message: "An error occurred while adding an item to your list.",
            okButtonText: "OK"
          });
          this.grocery = "";
        }
      )
  }

  share() {
    let list = [];
    for (let i = 0, size = this.groceryList.length; i < size ; i++) {
      list.push(this.groceryList[i].name);
    }
    let listString = list.join(", ").trim();
    socialShare.shareText(listString);
  }
}
