import {DeleteImageRequestDto} from "./image-request.dto";

export interface CreateProductRequestDto {
    name: string;
    description: string;
    manufacturer: string;
    price: number;
    quantity: number;
    subCategoryId: number;
}

export interface UpdateProductRequestDto extends Partial<CreateProductRequestDto> {
    deletedImages?: DeleteImageRequestDto[];
}

