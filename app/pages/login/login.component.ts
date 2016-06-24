import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {User} from "../../shared/user/user";
import {UserService} from "../../shared/user/user.service";
import {Router} from "@angular/router-deprecated";
import {Page} from "ui/page";
import {Color} from "color";
import {View} from "ui/core/view";

@Component({
  selector: "my-app",
  providers: [UserService],
  templateUrl: "pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"],
})

export class LoginPage implements OnInit {
  user: User;
  isLoggingIn = true;
  @ViewChild("container") container: ElementRef;

  constructor(private _router: Router, private _userService: UserService, private page: Page) {
	  this.user = new User();
	}
	ngOnInit() {
	  this.page.actionBarHidden = true;
	  this.page.backgroundImage = this.page.ios ? "res://bg_login.jpg" : "res://bg_login";
	}
  submit() {
    if (!this.user.isValidEmail()) {
      alert("Enter a valid email address.");
      return;
    }
	  if (this.isLoggingIn) {
	    this.login();
	  } else {
	    this.signUp();
	  }
	}
	login() {
    this._router.navigate(["List"]);
  // this._userService.login(this.user)
  //   .subscribe(
  //     () => this._router.navigate(["List"]),
  //     (error) => alert("Unfortunately we could not find your account.")
  //   );
	}
  signUp() {
	  this._userService.register(this.user)
	    .subscribe(
	      () => {
	        alert("Your account was successfully created.");
	        this.toggleDisplay();
	      },
	      () => alert("Unfortunately we were unable to create your account.")
	    );
	}
  toggleDisplay() {
	  this.isLoggingIn = !this.isLoggingIn;
	  let container = <View>this.container.nativeElement;
	  container.animate({
	    backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
	    duration: 200
	  });
	}
}
