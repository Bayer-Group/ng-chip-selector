import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ChipSelectorComponent } from './chip-selector.component';
import { MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule } from '@angular/material';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatChipsModule,
        MatInputModule,
        MatIconModule,
        MatTooltipModule
    ],
    declarations: [
        ChipSelectorComponent
    ],
    exports: [
        ChipSelectorComponent
    ]
})
export class ChipSelectorModule {}