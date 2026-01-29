import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './product.entity';
import { AttributeValue } from './attribute-value.entity';


@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  additionalPrice: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @ManyToMany(() => AttributeValue, (attributeValue) => attributeValue.productVariants, { cascade: true })
  @JoinTable({
    name: 'product_variant_attributes',
    joinColumn: { name: 'variantId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'attributeValueId', referencedColumnName: 'id' }
  })
  attributeValues: AttributeValue[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
