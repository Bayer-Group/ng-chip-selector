import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChipSelectorModule } from './chip-selector/chip-selector.module';
import { MatButtonModule, MatToolbarModule } from '@angular/material';

@NgModule({
    imports: [
        ChipSelectorModule,
        MatToolbarModule,
        MatButtonModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
