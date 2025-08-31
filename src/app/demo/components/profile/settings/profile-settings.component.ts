import {Component} from '@angular/core';
import {finalize, Observable, take} from "rxjs";
import {UserService} from "../../../../shared/services/user.service";
import {User} from "../../../../shared/models/user.model";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UpdateUserDto} from "../../../../shared/dto/request/user-request.dto";
import {firstError, FormSpec} from "../../../../shared/utils/form-validation.utils";
import {PATTERNS} from "../../../../shared/validation/validation-patterns";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {AuthService} from "../../../../shared/services/auth.service";


type EditableKey = 'firstName' | 'lastName' | 'email';

/** Regole del form (single form) */
const FORM_SPEC: FormSpec<EditableKey> = {
    firstName: {
        validators: [Validators.required, Validators.pattern(PATTERNS.personName(2, 29))],
        normalize: v => String(v ?? '').trim(),
    },
    lastName: {
        validators: [Validators.required, Validators.pattern(PATTERNS.personName(2, 29))],
        normalize: v => String(v ?? '').trim(),
    },
    email: {
        validators: [Validators.required, Validators.email, Validators.maxLength(254)],
        updateOn: 'blur',
        normalize: v => String(v ?? '').trim().toLowerCase(),
    },
};


@Component({
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent {

    protected userCache$: Observable<User | null>;

    protected dialogVisible = false;
    protected changePwdVisible = false;
    protected saving = false;
    protected savingPwd = false;
    private editingKey: EditableKey | null = null;
    protected editingLabel = '';

    /** niente validator all'inizio; settati in openEdit in base al campo in modifica */
    protected form = this.fb.group({
        value: ['']
    });

    protected formChangePwd: FormGroup = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
    }, {validators: [this.passwordsMatchValidator()]});

    private get valueCtrl(): FormControl | null {
        return this.form.get('value') as FormControl | null;
    }

    private get np() {
        return this.formChangePwd.get('newPassword');
    }

    private get cpw() {
        return this.formChangePwd.get('confirmPassword');
    }

    protected get firstErrorText(): string | null {
        return firstError(this.valueCtrl, this.editingLabel ?? 'Valore');
    }

    protected get getNpErrorText(): string | null {
        return firstError(this.np,  'Nuova password');
    }

    protected get getCpwErrorText(): string | null {
        return firstError(this.cpw, 'Conferma password');
    }

    constructor(private fb: FormBuilder,
                private userService: UserService,
                private messageService: MessageService,
                private authService: AuthService,) {
        this.userCache$ = this.userService.userCache$;
    }

    // -----------------------------------------------------------------------------------------------------------------

    protected openEdit(key: EditableKey, currentValue: string, label: string) {
        this.editingKey = key;
        this.editingLabel = label;

        const cfg = FORM_SPEC[key];
        const control = new FormControl(currentValue ?? '', {
            validators: cfg.validators,
            asyncValidators: cfg.asyncValidators ?? [],
            updateOn: cfg.updateOn ?? 'change',
        });

        this.form.setControl('value', control);
        this.dialogVisible = true;
    }

    protected openChangePwd() {
        this.formChangePwd.reset();
        this.changePwdVisible = true;
        // opzionale: mostra subito gli errori quando si prova a salvare
    }

    protected onCancel() {
        this.dialogVisible = false;
        this.form.reset();
        this.editingKey = null;
    }

    protected closeChangePwd() {
        this.changePwdVisible = false;
    }

    protected onSave(currentUser: User) {
        if (!this.editingKey) return;

        this.form.markAllAsTouched();
        this.valueCtrl?.updateValueAndValidity();
        if (this.form.invalid) return;

        const newValue = (this.valueCtrl?.value ?? '').toString().trim();
        const oldValue = (currentUser as any)[this.editingKey];
        if (newValue === oldValue) {
            this.onCancel();
            return;
        }

        const dto: UpdateUserDto = {
            firstName: this.editingKey === 'firstName' ? newValue : currentUser.firstName,
            lastName: this.editingKey === 'lastName' ? newValue : currentUser.lastName,
            email: this.editingKey === 'email' ? newValue : currentUser.email,
        };

        this.saving = true;
        this.userService.updateUserInfo(currentUser.username, dto)
            .pipe(take(1), finalize(() => this.saving = false))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Informazioni aggiornate',
                        detail: 'Le informazioni da te inserite sono state aggiornate correttamente',
                        life: 5000
                    });

                    this.dialogVisible = false;
                    this.form.reset();
                    this.editingKey = null;
                },
                error: () => {
                }
            });
    }

    protected onSubmitChangePwd(currentUser: User) {
        // Blocca se invalido e mostra errori
        if (this.formChangePwd.invalid || this.savingPwd) {
            this.formChangePwd.markAllAsTouched();
            return;
        }

        const newPassword = this.np?.value as string;

        this.savingPwd = true;
        const dto = {password: newPassword};

        this.userService.updatePassword(currentUser.username, dto)
            .pipe(finalize(() => this.savingPwd = false))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Password aggiornata',
                        detail: 'Sei stato disconnesso, effettua nuovamente il login con la nuova password.',
                        life: 5000
                    });

                    this.changePwdVisible = false;
                    this.formChangePwd.reset();

                    void this.authService.logout();
                },
                error: () => {
                }
            });
    }

    protected isInvalid(): boolean {
        const c = this.valueCtrl;
        return !!c && c.invalid && (c.dirty || c.touched);
    }

    protected isInvalidNP() {
        return !!this.np && this.np.invalid && (this.np.dirty || this.np.touched);
    }

    protected isInvalidCPW() {
        return !!this.cpw && this.cpw.invalid && (this.cpw.dirty || this.cpw.touched);
    }

    private passwordsMatchValidator() {
        return (group: AbstractControl): ValidationErrors | null => {
            const np = group.get('newPassword')?.value;
            const cpw = group.get('confirmPassword')?.value;
            return np && cpw && np !== cpw ? {passwordMismatch: true} : null;
        };
    }

}
