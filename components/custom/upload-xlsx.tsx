"use client";

import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/custom/file-input";
import { Paperclip } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import * as XLSX from "xlsx";

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-white dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-white dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-white dark:text-gray-400">
        SVG, PNG, JPG, GIF, or Excel (xlsx)
      </p>
    </>
  );
};

// Define the schema using zod
const FileUploadSchema = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 10 * 1024 * 1024, {
        message: "File size must be less than 10MB",
      })
    )
    .max(1, {
      message: "Only one file is allowed",
    })
    .nullable(),
});

type FileUploadFormType = z.infer<typeof FileUploadSchema>;

const FileUploaderTest = () => {
  // Initialize react-hook-form with zod validation
  const form = useForm<FileUploadFormType>({
    resolver: zodResolver(FileUploadSchema),
    defaultValues: {
      files: null,
    },
  });

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 10,
    multiple: false,
  };

  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      // Process the workbook and get the first sheet data
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("Excel Data:", jsonData);
      // You can now use the jsonData for further processing
    };

    reader.readAsArrayBuffer(file);
  };

  const onSubmit = (data: FileUploadFormType) => {
    if (data.files) {
      handleFileUpload(data.files);
    }
    alert("File processing complete");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative bg-primary rounded-lg p-2"
      >
        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-primary rounded-lg p-2"
                >
                  <FileInput className="outline-dashed outline-1 outline-white px-2">
                    <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                      <FileSvgDraw />
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {field.value &&
                      field.value.length > 0 &&
                      field.value.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {form.formState.errors.files && (
          <div className="text-destructive text-sm">
            {form.formState.errors.files.message}
          </div>
        )}
        <Button type="submit" className="h-8 w-fit">
          Upload
        </Button>
      </form>
    </Form>
  );
};

export default FileUploaderTest;
