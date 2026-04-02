import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'FBB Store <no-reply@flybuybrand.com>',
      to: email,
      subject: 'Verify your email - FBB Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">FBB Store</h1>
            <p style="color: #666;">Premium Fashion & Accessories</p>
          </div>
          
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Email Verification</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
            Thank you for registering with FBB Store. Please use the following OTP to verify your email address:
          </p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    padding: 25px; 
                    text-align: center; 
                    border-radius: 8px;
                    margin: 30px 0;">
            <div style="font-size: 36px; 
                       font-weight: bold; 
                       color: white; 
                       letter-spacing: 8px;
                       font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #888; font-size: 14px; text-align: center; margin-top: 20px;">
            This OTP is valid for 5 minutes. Do not share it with anyone.
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              If you didn't create an account with FBB Store, please ignore this email.
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px;">
              © ${new Date().getFullYear()} FBB Store. All rights reserved.<br>
              This is an automated email, please do not reply.
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend API error:', error);
      return false;
    }

    console.log('OTP email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

export const sendOrderConfirmationEmail = async (email, order) => {

    console.log(email,"emaiiiiiiiiiiiiiiiiii")
  try {
    const itemsHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 15px; vertical-align: top;">
          <div style="font-weight: 500; color: #333;">${item.product?.name || 'Product'}</div>
          ${item.selectedColor ? `<div style="color: #666; font-size: 14px;">Color: ${item.selectedColor}</div>` : ''}
          ${item.selectedSize ? `<div style="color: #666; font-size: 14px;">Size: ${item.selectedSize}</div>` : ''}
        </td>
        <td style="padding: 15px; text-align: center; vertical-align: top;">${item.quantity}</td>
        <td style="padding: 15px; text-align: right; vertical-align: top;">₹${item.price}</td>
        <td style="padding: 15px; text-align: right; vertical-align: top;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const sellerOrdersHtml = order.sellerOrders.map(sellerOrder => `
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <div style="font-weight: 500; color: #333; margin-bottom: 10px;">${sellerOrder.seller?.name || 'Seller'}</div>
        <div style="display: flex; justify-content: space-between; font-size: 14px;">
          <span>Items: ${sellerOrder.items.length}</span>
          <span>Status: <span style="color: #667eea;">${sellerOrder.sellerStatus}</span></span>
        </div>
      </div>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: 'FBB Store Orders <no-reply@flybuybrand.com>',
      to: email,
      subject: `Order Confirmation #${order.orderId} - FBB Store`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 30px; background: #ffffff; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0;">
            <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">FBB Store</h1>
            <p style="color: #666; font-size: 16px;">Thank you for your order!</p>
            <p style="color: #667eea; font-size: 18px; font-weight: 500; margin-top: 10px;">
              Order #${order.orderId}
            </p>
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="color: #333; font-size: 20px; margin-bottom: 20px;">Order Summary</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr style="background: #f8f9fa; border-bottom: 2px solid #e9ecef;">
                  <th style="padding: 15px; text-align: left; font-weight: 600; color: #333;">Product</th>
                  <th style="padding: 15px; text-align: center; font-weight: 600; color: #333;">Qty</th>
                  <th style="padding: 15px; text-align: right; font-weight: 600; color: #333;">Price</th>
                  <th style="padding: 15px; text-align: right; font-weight: 600; color: #333;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="background: #f9f9f9; padding: 25px; border-radius: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Subtotal:</span>
                <span style="font-weight: 500;">₹${order.subtotal}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Shipping:</span>
                <span style="font-weight: 500;">₹${order.shipping}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Tax (18%):</span>
                <span style="font-weight: 500;">₹${order.tax}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 2px solid #e9ecef; font-size: 18px;">
                <span style="color: #333; font-weight: 600;">Total:</span>
                <span style="color: #667eea; font-weight: 600;">₹${order.total}</span>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="color: #333; font-size: 20px; margin-bottom: 20px;">Order Status</h2>
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <div style="background: ${order.status === 'pending' ? '#667eea' : '#e9ecef'}; 
                          color: white; 
                          padding: 8px 16px; 
                          border-radius: 20px; 
                          font-size: 14px; 
                          font-weight: 500;
                          margin-right: 10px;">
                Pending
              </div>
              <div style="background: ${order.status === 'processing' ? '#667eea' : '#e9ecef'}; 
                          color: white; 
                          padding: 8px 16px; 
                          border-radius: 20px; 
                          font-size: 14px; 
                          font-weight: 500;
                          margin-right: 10px;">
                Processing
              </div>
              <div style="background: ${order.status === 'shipped' ? '#667eea' : '#e9ecef'}; 
                          color: white; 
                          padding: 8px 16px; 
                          border-radius: 20px; 
                          font-size: 14px; 
                          font-weight: 500;">
                Shipped
              </div>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
              Current status: <span style="color: #667eea; font-weight: 500;">${order.status}</span>
            </p>
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">Seller Information</h2>
            ${sellerOrdersHtml}
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">Shipping Address</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
              <p style="color: #333; margin-bottom: 5px; font-weight: 500;">${order.shippingAddress.fullName}</p>
              <p style="color: #666; margin-bottom: 5px;">${order.shippingAddress.address}</p>
              <p style="color: #666; margin-bottom: 5px;">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
              <p style="color: #666; margin-bottom: 5px;">Phone: ${order.shippingAddress.phone}</p>
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">Payment Information</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Method:</span>
                <span style="font-weight: 500; color: #333;">${order.paymentMethod.toUpperCase()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">Status:</span>
                <span style="font-weight: 500; color: ${order.paymentStatus === 'completed' ? '#28a745' : '#ffc107'}">
                  ${order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          <div style="text-align: center; padding-top: 30px; border-top: 2px solid #f0f0f0;">
            <p style="color: #666; margin-bottom: 15px;">
              You can track your order anytime from your account dashboard.
            </p>
            <a href="${process.env.FRONTEND_URL}/orders/${order.orderId}" 
               style="display: inline-block; 
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: 500;
                      margin-bottom: 20px;">
              View Order Details
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              © ${new Date().getFullYear()} FBB Store. All rights reserved.<br>
              This is an automated email, please do not reply.
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend API error:', error);
      return false;
    }

    console.log('Order confirmation email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

export const sendSellerNewOrderEmail = async (sellerEmail, order, sellerOrder) => {
  try {
    const itemsHtml = sellerOrder.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; vertical-align: top;">
          <div style="font-weight: 500; color: #333;">${item.product?.name || 'Product'}</div>
          <div style="color: #666; font-size: 13px;">
            Color: ${item.selectedColor || 'N/A'} | Size: ${item.selectedSize || 'N/A'}
          </div>
        </td>
        <td style="padding: 12px; text-align: center; vertical-align: top;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; vertical-align: top;">₹${item.price}</td>
        <td style="padding: 12px; text-align: right; vertical-align: top;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: 'FBB Store Seller <no-reply@flybuybrand.com>',
      to: sellerEmail,
      subject: `New Order Received #${order.orderId} - FBB Store`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0;">
            <h1 style="color: #333; margin-bottom: 10px; font-size: 24px;">FBB Store Seller Portal</h1>
            <p style="color: #667eea; font-size: 18px; font-weight: 500; margin-top: 10px;">
              New Order Notification
            </p>
          </div>

          <div style="margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      padding: 15px; 
                      border-radius: 8px; 
                      text-align: center;
                      margin-bottom: 20px;">
              <div style="font-size: 20px; color: white; font-weight: 600; margin-bottom: 5px;">
                Order #${order.orderId}
              </div>
              <div style="font-size: 14px; color: rgba(255,255,255,0.9);">
                Received: ${new Date(order.createdAt).toLocaleString()}
              </div>
            </div>

            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Your Items in This Order</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #333; font-size: 14px;">Product</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600; color: #333; font-size: 14px;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #333; font-size: 14px;">Price</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #333; font-size: 14px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Subtotal:</span>
                <span style="font-weight: 500;">₹${sellerOrder.subtotal}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Shipping:</span>
                <span style="font-weight: 500;">₹${sellerOrder.shipping}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Tax (18%):</span>
                <span style="font-weight: 500;">₹${sellerOrder.tax}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid #e9ecef;">
                <span style="color: #333; font-weight: 600;">Your Total:</span>
                <span style="color: #667eea; font-weight: 600;">₹${sellerOrder.total}</span>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Shipping Information</h2>
            <div style="background: #f9f9f9; padding: 18px; border-radius: 8px;">
              <p style="color: #333; margin-bottom: 5px; font-weight: 500;">${order.shippingAddress.fullName}</p>
              <p style="color: #666; margin-bottom: 5px;">${order.shippingAddress.address}</p>
              <p style="color: #666; margin-bottom: 5px;">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
              <p style="color: #666; margin-bottom: 5px;">Phone: ${order.shippingAddress.phone}</p>
              ${order.shippingAddress.landmark ? `<p style="color: #666;">Landmark: ${order.shippingAddress.landmark}</p>` : ''}
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Customer Information</h2>
            <div style="background: #f9f9f9; padding: 18px; border-radius: 8px;">
              <p style="color: #333; margin-bottom: 5px;">
                <strong>Name:</strong> ${order.user?.name || 'N/A'}
              </p>
              <p style="color: #333; margin-bottom: 5px;">
                <strong>Email:</strong> ${order.user?.email || 'N/A'}
              </p>
              <p style="color: #333; margin-bottom: 5px;">
                <strong>Phone:</strong> ${order.user?.phone || order.shippingAddress.phone}
              </p>
              <p style="color: #333;">
                <strong>Order Notes:</strong> ${order.notes || 'No special instructions'}
              </p>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Next Steps</h2>
            <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <ol style="color: #333; padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 10px;">Review and prepare the items listed above</li>
                <li style="margin-bottom: 10px;">Update order status in your seller dashboard</li>
                <li style="margin-bottom: 10px;">Ship within 24-48 hours to avoid delays</li>
                <li style="margin-bottom: 10px;">Update tracking information once shipped</li>
              </ol>
            </div>
          </div>

          <div style="text-align: center; padding-top: 25px; border-top: 2px solid #f0f0f0;">
            <a href="${process.env.SELLER_PORTAL_URL}/orders/${order.orderId}" 
               style="display: inline-block; 
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: 500;
                      margin-bottom: 15px;">
              Go to Seller Dashboard
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              © ${new Date().getFullYear()} FBB Store Seller Portal<br>
              This is an automated notification, please do not reply.
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend API error:', error);
      return false;
    }

    console.log('Seller new order email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending seller new order email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const { data, error } = await resend.emails.send({
      from: 'FBB Store Support <no-reply@flybuybrand.com>',
      to: email,
      subject: 'Password Reset Request - FBB Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #ffffff; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">FBB LuxStoreury</h1>
            <p style="color: #666;">Password Reset Request</p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #555; line-height: 1.6;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetLink}" 
               style="display: inline-block; 
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 35px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: 500;
                      font-size: 16px;">
              Reset Your Password
            </a>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #888; font-size: 14px;">
              Or copy and paste this link in your browser:<br>
              <span style="color: #667eea; word-break: break-all;">${resetLink}</span>
            </p>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              If you didn't request a password reset, you can safely ignore this email. 
              Your password will not be changed.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              This link will expire in 1 hour for security reasons.
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px;">
              © ${new Date().getFullYear()} FBB Store. All rights reserved.<br>
              This is an automated email, please do not reply.
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend API error:', error);
      return false;
    }

    console.log('Password reset email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

export const sendOrderStatusUpdateEmail = async (email, order, updateType) => {
  try {
    let subject = '';
    let statusText = '';
    let message = '';

    switch (updateType) {
      case 'shipped':
        subject = `Your Order #${order.orderId} Has Been Shipped!`;
        statusText = 'Shipped';
        message = 'Your order has been shipped and is on its way to you.';
        break;
      case 'delivered':
        subject = `Your Order #${order.orderId} Has Been Delivered!`;
        statusText = 'Delivered';
        message = 'Your order has been successfully delivered.';
        break;
      case 'cancelled':
        subject = `Order #${order.orderId} Cancellation Update`;
        statusText = 'Cancelled';
        message = 'Your order has been cancelled.';
        break;
      default:
        subject = `Order #${order.orderId} Status Update`;
        statusText = 'Updated';
        message = 'Your order status has been updated.';
    }

    const { data, error } = await resend.emails.send({
      from: 'FBB Store Orders <no-reply@flybuybrand.com>',
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #ffffff; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">FBB Store</h1>
            <p style="color: #666;">Order Status Update</p>
          </div>

          <div style="background: #f9f9f9; padding: 25px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 15px;">${subject}</h2>
            <div style="font-size: 48px; margin: 20px 0;">
              ${updateType === 'shipped' ? '🚚' : updateType === 'delivered' ? '✓' : updateType === 'cancelled' ? '✗' : '📦'}
            </div>
            <p style="color: #555; font-size: 18px; margin-bottom: 10px;">
              Order #${order.orderId}
            </p>
            <div style="display: inline-block; 
                      background: ${updateType === 'shipped' ? '#007bff' : updateType === 'delivered' ? '#28a745' : updateType === 'cancelled' ? '#dc3545' : '#ffc107'}; 
                      color: white; 
                      padding: 8px 20px; 
                      border-radius: 20px; 
                      font-weight: 500;">
              ${statusText}
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #555; line-height: 1.6;">
              ${message}
            </p>
            <p style="color: #555; line-height: 1.6; margin-top: 15px;">
              Estimated delivery date: ${order.items[0]?.estimatedDeliveryDate ? new Date(order.items[0].estimatedDeliveryDate).toLocaleDateString() : '3-7 business days'}
            </p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
              <p style="color: #333; margin-bottom: 5px;">
                <strong>Order ID:</strong> ${order.orderId}
              </p>
              <p style="color: #333; margin-bottom: 5px;">
                <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p style="color: #333; margin-bottom: 5px;">
                <strong>Total:</strong> ₹${order.total}
              </p>
              <p style="color: #333;">
                <strong>Payment:</strong> ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})
              </p>
            </div>
          </div>

          ${updateType === 'shipped' && order.items.some(item => item.trackingNumber) ? `
            <div style="margin-bottom: 30px;">
              <h3 style="color: #333; margin-bottom: 15px;">Tracking Information</h3>
              <div style="background: #f0f7ff; padding: 20px; border-radius: 8px;">
                ${order.items.filter(item => item.trackingNumber).map(item => `
                  <div style="margin-bottom: 10px;">
                    <p style="color: #333; margin-bottom: 5px;">
                      <strong>${item.product?.name || 'Product'}:</strong>
                    </p>
                    <p style="color: #666; margin-bottom: 5px;">
                      Tracking: ${item.trackingNumber}
                    </p>
                    <p style="color: #666;">
                      Carrier: ${item.shippingProvider || 'Standard Shipping'}
                    </p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.FRONTEND_URL}/orders/${order.orderId}" 
               style="display: inline-block; 
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: 500;">
              View Order Details
            </a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #999; font-size: 12px;">
              Need help? Contact our support team at support@fbbsore.com<br>
              © ${new Date().getFullYear()} FBB Store. All rights reserved.
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend API error:', error);
      return false;
    }

    console.log('Order status update email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return false;
  }
};