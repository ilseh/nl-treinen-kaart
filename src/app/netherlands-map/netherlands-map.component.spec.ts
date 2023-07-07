import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetherlandsMapComponent } from './netherlands-map.component';

describe('NetherlandsMapComponent', () => {
  let component: NetherlandsMapComponent;
  let fixture: ComponentFixture<NetherlandsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetherlandsMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetherlandsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
