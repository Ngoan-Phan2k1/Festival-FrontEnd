import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Hotel } from "./hotel.model";
import { Room } from "./hotel-room/room.model";


@Injectable({providedIn: "root"})
export class HotelService {
    hotelChanged = new Subject<Hotel>();
    roomsChanged = new Subject<Room[]>();

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'A Test Recipe', 
    //         'This is simply a test', 
    //     'https://afamilycdn.com/150157425591193600/2020/4/7/artboard-4-copy-15862291049461560863285.png',
    //     [
    //         new Ingredient('Meat', 1),
    //         new Ingredient('French Fries', 20)
    //     ]),
    //     new Recipe('Banh Bao', 'This is simply a test', 
    //     'https://beptruong.edu.vn/wp-content/uploads/2021/03/banh-bao-nhan-thit-dam-da-kho-quen.jpg', 
    //     [
    //         new Ingredient('Buns', 2),
    //         new Ingredient('Meat', 1)
    //     ]),
    // ];
    private hotel: Hotel;
    private rooms: Room[] = [];

    constructor(

    ){}

    setHotel(hotel: Hotel) {
        this.hotel = hotel;
        //this.rooms = this.hotel.rooms;
        this.hotelChanged.next(this.hotel);
        //console.log(this.recipes)
    }

    setRooms(rooms: Room[]) {
       this.rooms = rooms;
        this.roomsChanged.next(this.rooms.slice());
    }

    getHotel() {
        return this.hotel;
    }

    getRooms() {
        return this.rooms.slice();
    }

    // getRecipes() {
    //     return this.recipes.slice();
    // }

    // addIngredientsToShoppingList(ingredients: Ingredient[]) {
    //     this.slService.addIngredients(ingredients);
    // }

    // getRecipe(index: number) {
    //     return this.recipes[index];
    // }

    // addRecipe(recipe: Recipe) {
    //     // console.log(this.recipes)
    //     this.recipes.push(recipe);
    //     this.recipesChanged.next(this.recipes.slice());
    // }

    // updateRecipe(index: number, newRecipe: Recipe) {
    //     this.recipes[index] = newRecipe;
    //     this.recipesChanged.next(this.recipes.slice());
    // }

    // deleteRecipe(index: number) {
    //     this.recipes.splice(index, 1);
    //     this.recipesChanged.next(this.recipes.slice());
    // }
}