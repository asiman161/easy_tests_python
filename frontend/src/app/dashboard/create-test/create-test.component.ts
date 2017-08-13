import { Component, OnInit, NgZone, Inject, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr';

import { Angular2TokenService } from '../../shared/api-factory/angular2-token.service';
import { SidebarEventsService } from '../../sidebar/sidebar-events.service';
import { CreateTestService } from './create-test.service';

@Component({
  selector: 'app-create-work',
  templateUrl: './create-test.component.html',
  providers: [CreateTestService]
})
export class CreateTestComponent implements OnInit {
  @ViewChild('select') select: any;
  response: any;
  hasBaseDropZoneOver: boolean;
  userIdLoaded = false;
  public testType = 1;
  public subjects: Object[] = [];
  public createWork: FormGroup;
  public variantsCount: number[] = [0];

  constructor(@Inject(NgZone) private zone: NgZone,
              private _router: Router,
              private _token: Angular2TokenService,
              private _fb: FormBuilder,
              private _toastr: ToastsManager,
              private _sidebarEventsService: SidebarEventsService,
              private _createTestService: CreateTestService) {
  }

  setSubject(subject) {
    this.createWork.controls['subject_id'].setValue(subject.id);
  }

  ngOnInit() {
    this.createWork = this._fb.group({
      subject_id: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(5)]],
      time: ['0', [Validators.required, Validators.pattern(/^\d*$/)]],
      random_variant: false,
      variants: this._fb.array([
        this.initVariants()
      ])
    });
    this._token.get('subjects/').subscribe((res: any) => {
      const subjectsResponse = res.json();
      this.subjects = subjectsResponse.map(item => {
        return {text: item.name, id: item.id};
      });
    });
  }

  initVariants() {
    return this._fb.group({
      questions: this._fb.array([
        this.initQuestions()
      ])
    });
  }

  initQuestions() {
    if (this.testType === 0) {
      return this._fb.group({
        question_text: ['', Validators.required]
      });
    } else if (this.testType === 1) {
      return this._fb.group({
        question_text: ['', Validators.required],
        question_right_answers: [],
        question_answers: this._fb.array([
          this.initAnswers()
        ])
      });
    }
  }

  initAnswers() {
    return this._fb.group({
      answer: ['', Validators.required]
    });
  }

  addVariant() {
    const control = <FormArray>this.createWork.controls['variants'];
    control.push(this.initVariants());
    this.variantsCount.push(0);
  }

  removeVariant(i: number) {
    const control = <FormArray>this.createWork.controls['variants'];
    control.removeAt(i);
    this.variantsCount.pop();
  }

  changeTestType(testType) {
    this.testType = testType;
    this.createWork = this._fb.group({
      subject_id: [this.select.active[0] ? this.select.active[0].id : '', Validators.required],
      title: ['', [Validators.required, Validators.minLength(5)]],
      time: [0, [Validators.required, Validators.pattern(/\d/)]],
      random_variant: false,
      variants: this._fb.array([
        this.initVariants()
      ])
    });
  }

  save() {
    if (this.createWork.valid) {
      let answers = new Array(this.createWork.value.variants.length);
      for (let i = 0; i < this.createWork.value.variants.length; i++) {
        answers[i] = !answers[i] ? [] : answers[i]; // if arr[i] undefined create new arr
        for (let j = 0; j < this.createWork.value.variants[i].questions.length; j++) {
          answers[i][j] = this.createWork.value.variants[i].questions[j].question_right_answers;
          this.createWork.value.variants[i].questions[j].question_right_answers = [];
        }
      }

      this._createTestService.save({
        answers: answers,
        name: this.createWork.value.title,
        subject: this.createWork.value.subject_id,
        test_type: this.testType,
        time: this.createWork.value.time,
        random_variant: this.createWork.value.random_variant,
        data: this.createWork.value.variants
      }).subscribe(() => {
        this._toastr.success('Работа успешно создана', 'Успешно!');
        this._sidebarEventsService.sidebarUpdate.emit({target: 'update'});
        this._router.navigateByUrl('/tests-list');
      }, () => {
        this._toastr.error('Что-то пошло не так', 'Ошибка!');
      });
    } else {
      this._toastr.error('В форме присутствуют ошибки\nУбедитесь, что все поля заполненны верно', 'Ошибка!');
      console.error('form doesn\'t valid');
    }
  }
}

