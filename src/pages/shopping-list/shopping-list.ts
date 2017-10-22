import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  shoppingListRef$: AngularFireList<ShoppingItem>;
  shoppingList: Observable<ShoppingItem[]>;
  email:string;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private database: AngularFireDatabase,
    private actionSheetCtrl: ActionSheetController) {

    this.shoppingListRef$ = this.database.list('shopping-list');

    this.shoppingList = this.shoppingListRef$.snapshotChanges()
      .map(actionArray => 
         actionArray.map(action =>
          ({ key: action.payload.key, ...action.payload.val() }) as ShoppingItem)
      )
      .do(console.log);
  }


  selectShoppingItem(item: ShoppingItem) {
    this.actionSheetCtrl.create({
      title: `${item.itemName}`,
      buttons: [
        {
          text: "Delete",
          role: 'destructive',
          handler: () => {
            console.log(item);
            this.shoppingListRef$.remove(item.key);
          }
        },
        {
          text: 'Edit',
          handler: () => {
            this.navCtrl.push("EditShoppingItemPage", { ShoppingItemId: item.key });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("The user has selected cancel-button.");
          }
        }
      ]
    }).present();
  }


  navigateToAddShoppingPage(): void {
    this.navCtrl.push("AddShoppingPage");
  }

  signOut(){
    this.navCtrl.setRoot('LoginPage');
  }

}
// this app is done by Petteri Vaskin