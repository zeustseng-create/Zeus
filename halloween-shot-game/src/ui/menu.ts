class Menu {
    constructor() {
        this.menuItems = ['Start Game', 'Pause', 'End Game'];
        this.selectedItem = 0;
    }

    displayMenu() {
        console.clear();
        console.log('Halloween Shot Game Menu');
        this.menuItems.forEach((item, index) => {
            if (index === this.selectedItem) {
                console.log(`> ${item}`);
            } else {
                console.log(`  ${item}`);
            }
        });
    }

    navigateUp() {
        this.selectedItem = (this.selectedItem > 0) ? this.selectedItem - 1 : this.menuItems.length - 1;
    }

    navigateDown() {
        this.selectedItem = (this.selectedItem < this.menuItems.length - 1) ? this.selectedItem + 1 : 0;
    }

    selectItem() {
        switch (this.selectedItem) {
            case 0:
                console.log('Starting Game...');
                break;
            case 1:
                console.log('Game Paused...');
                break;
            case 2:
                console.log('Ending Game...');
                break;
        }
    }
}

export default Menu;