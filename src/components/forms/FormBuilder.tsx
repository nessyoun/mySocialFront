import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'multiselect' | 'date' | 'checkbox' | 'file';
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  validation?: z.ZodType<any>;
  conditional?: {
    field: string;
    value: any;
  };
}

interface FormBuilderProps {
  fields: FormField[];
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
  loading?: boolean;
  submitLabel?: string;
}

export default function FormBuilder({
  fields,
  onSubmit,
  defaultValues = {},
  loading = false,
  submitLabel = 'Enregistrer'
}: FormBuilderProps) {
  // Build Zod schema from fields
  const schemaFields: Record<string, z.ZodType<any>> = {};
  
  fields.forEach(field => {
    let fieldSchema = field.validation || z.any();
    
    if (field.required) {
      fieldSchema = fieldSchema.refine(val => val !== undefined && val !== null && val !== '', {
        message: `${field.label} est requis`
      });
    }
    
    schemaFields[field.name] = fieldSchema;
  });

  const schema = z.object(schemaFields);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  const watchedValues = watch();

  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditional) return true;
    
    const conditionValue = watchedValues[field.conditional.field];
    return conditionValue === field.conditional.value;
  };

  const renderField = (field: FormField) => {
    if (!isFieldVisible(field)) return null;

    const error = errors[field.name];
    const hasError = !!error;

    return (
      <div key={field.name} className="field mb-4">
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => {
            switch (field.type) {
              case 'text':
              case 'email':
                return (
                  <InputText
                    {...controllerField}
                    id={field.name}
                    placeholder={field.placeholder}
                    className={classNames('w-full', { 'p-invalid': hasError })}
                    type={field.type}
                  />
                );

              case 'number':
                return (
                  <InputNumber
                    {...controllerField}
                    id={field.name}
                    placeholder={field.placeholder}
                    className={classNames('w-full', { 'p-invalid': hasError })}
                    onValueChange={(e) => controllerField.onChange(e.value)}
                  />
                );

              case 'textarea':
                return (
                  <InputTextarea
                    {...controllerField}
                    id={field.name}
                    placeholder={field.placeholder}
                    className={classNames('w-full', { 'p-invalid': hasError })}
                    rows={4}
                  />
                );

              case 'select':
                return (
                  <Dropdown
                    {...controllerField}
                    id={field.name}
                    options={field.options}
                    placeholder={field.placeholder || 'Sélectionner...'}
                    className={classNames('w-full', { 'p-invalid': hasError })}
                  />
                );

              case 'multiselect':
                return (
                  <MultiSelect
                    {...controllerField}
                    id={field.name}
                    options={field.options}
                    placeholder={field.placeholder || 'Sélectionner...'}
                    className={classNames('w-full', { 'p-invalid': hasError })}
                    display="chip"
                  />
                );

              case 'date':
                return (
                  <Calendar
                    {...controllerField}
                    id={field.name}
                    placeholder={field.placeholder}
                    className={classNames('w-full', { 'p-invalid': hasError })}
                    dateFormat="dd/mm/yy"
                    showIcon
                  />
                );

              case 'checkbox':
                return (
                  <Checkbox
                    {...controllerField}
                    id={field.name}
                    checked={controllerField.value || false}
                    onChange={(e) => controllerField.onChange(e.checked)}
                    className={classNames({ 'p-invalid': hasError })}
                  />
                );

              case 'file':
                return (
                  <FileUpload
                    name={field.name}
                    accept="image/*,.pdf,.doc,.docx"
                    maxFileSize={5000000}
                    emptyTemplate={
                      <p className="text-center text-gray-500">
                        Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                      </p>
                    }
                    className={classNames('w-full', { 'p-invalid': hasError })}
                  />
                );

              default:
                return null;
            }
          }}
        />
        
        {hasError && (
          <small className="text-red-500 mt-1 block">
            {error?.message as string}
          </small>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map(renderField)}
      
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          label={submitLabel}
          loading={loading}
          className="px-6"
        />
      </div>
    </form>
  );
}